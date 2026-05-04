import os

import torch
from app.utils.model_inference.ours import Model
import pandas as pd
import numpy as np

DATASET_REGISTRY = {
    'PJM': {
        'enc_in': 24,  # 19 subs + 5 weather
        'subs': ['AE','AEP','AP','ATSI','BC','CE','DAY','DEOK','DOM',
                 'DPL','DUQ','EKPC','JC','ME','PE','PEP','PL','PN','PS'],
    },
    'NYIS': {
        'enc_in': 15,  # 10 + 5
        'subs': ['ZONA','ZONB','ZONC','ZOND','ZONE','ZONF','ZONG','ZONH','ZONI','ZONJ'],
    },
    'ISNE': {
        'enc_in': 13,  # 8 + 5
        'subs': ['4001','4002','4003','4004','4005','4006','4007','4008'],
    },
}

def load_data(dataset, sub_name, root_path='/app/app/utils/datasets/'):
    """Load OT + weather, join, return raw numpy arrays."""
    info = DATASET_REGISTRY[dataset]

    # Load OT
    df = pd.read_csv(os.path.join(root_path, f'{dataset}_OT_data.csv'), index_col='date')
    df = df[info['subs']]
    
    # Build new_cols: target sub first, then the rest (same as run.py)
    feature_list = info['subs']
    sub_index = feature_list.index(sub_name)
    new_cols = [sub_name] + [s for j, s in enumerate(feature_list) if j != sub_index]
    df = df[new_cols]

    # Load weather for this sub, join
    df_w = pd.read_csv(os.path.join(root_path, f'{dataset}_weather_data.csv'), index_col='date')
    df_w = df_w[df_w['sub'].astype(str) == str(sub_name)]
    df_w = df_w[['tmpf', 'relh', 'sknt', 'alti', 'vsby']]
    df = df.join(df_w, how='left')

    # Test: 2024, plus seq_len lookback
    test = df[(df.index >= '2024-01-01') & (df.index < '2025-01-01')]
    start = df.index.get_loc(test.index[0]) - 168
    data = df.values[start:]
    dates = pd.to_datetime(df.index[start:start + len(data)])

    # timeenc=0: month, day, weekday, hour
    dates = pd.to_datetime(df.index[start:start + len(data)])
    stamps = np.stack([
        dates.month,
        dates.day,
        dates.weekday,
        dates.hour,
    ], axis=-1).astype(np.float32)  # (n_hours, 4)

    return data, stamps


def build_one_sample(data, stamps, idx=0):
    """
    Build the 4 model inputs: x_enc, x_mark_enc, x_dec, x_mark_dec
    
    x_enc      = (batch_x, batch_weather)   tuple
    x_mark_enc = batch_x_mark               (1, 168, 4)
    x_dec      = dec_inp                     (1, 192, enc_in)
    x_mark_dec = batch_y_mark                (1, 192, 4)
    """
    seq_len, pred_len, label_len = 168, 24, 168

    s = idx
    e = s + seq_len

    # encoder input
    batch_x = torch.tensor(data[s:e], dtype=torch.float32).unsqueeze(0)          # (1, 168, enc_in)
    x_enc = batch_x

    # encoder time marks
    x_mark_enc = torch.tensor(stamps[s:e], dtype=torch.float32).unsqueeze(0)     # (1, 168, 4)

    # ground truth for decoder construction
    batch_y = torch.tensor(data[e - label_len:e + pred_len], dtype=torch.float32).unsqueeze(0)  # (1, 192, enc_in)

    # decoder time marks
    x_mark_dec = torch.tensor(stamps[e - label_len:e + pred_len], dtype=torch.float32).unsqueeze(0)  # (1, 192, 4)

    # true target
    true = batch_y[:, -pred_len:, [0]]  # (1, 24, 1)

    return x_enc, x_mark_enc, x_mark_dec, true
