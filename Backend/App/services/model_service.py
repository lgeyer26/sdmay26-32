import torch
import os
import pandas as pd
import numpy as np
from app.utils.model_inference.ours import Model
from app.services.preprocess import build_one_sample, load_data

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

class Cfg:
    seq_len = 168;  pred_len = 24;  enc_in = 1
    time_emb_dim = 4;  number_of_targets = 0
    F_conv_output = 10;  F_noconv_output = 10
    F_gconv_output_rate = 1;  F_lin_output = 10
    F_id_output_rate = 1;  F_emb_output = 10
    mlp_ratio = 1;  predictor = 'Default';  predictor_dropout = 0.1
    temporal_gate = False;  channel_sparsity = False
    label_len = 168;  single_tmpf = False
    # add any missing attrs your predictor needs
    dropout = 0.1;  output_attention = False
    continuity_beta = 1
    d_model = 128;  n_heads = 8;  d_ff = 64;  activation = 'gelu'

class ModelService:
    def build_model(dataset, checkpoint_path, device='cpu'):
        """
        Build CATS model for sub_train + weather_train mode.
        enc_in = n_subs + weather_enc
        """
        info = DATASET_REGISTRY[dataset]
        cfg = Cfg()
        cfg.enc_in = info['enc_in']# e.g. PJM: 19+5=24
        cfg.single_tmpf = False

        model = Model(cfg).float().to(device)
        model.load_state_dict(torch.load(checkpoint_path, map_location=device))
        model.eval()
        return model, cfg
    
    def inference(model, cfg, x_enc, x_mark_enc, x_mark_dec, device='cpu'):
        """
        x_enc:     (B, seq_len, n_subs + weather_enc)  — load + weather already concatenated
        x_weather: (B, seq_len, weather_dim)            — passed in tuple but unused when single_tmpf=False
        """
        with torch.no_grad():
            x_enc = x_enc.float().to(device)
            x_mark = x_mark_enc.float().to(device)
            y_mark = x_mark_dec.float().to(device)

            batch_x = x_enc

            dec_inp = torch.zeros(x_enc.shape[0], cfg.label_len + cfg.pred_len,
                                x_enc.shape[-1]).float().to(device)

            output = model((batch_x), x_mark, dec_inp, y_mark)
            pred = output[:, -cfg.pred_len:, [0]]
        return pred

