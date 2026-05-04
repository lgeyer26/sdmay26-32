class Config:
    def __init__(self):
        self.seq_len = 168;  
        self.pred_len = 24;  
        self.enc_in = 1
        self.time_emb_dim = 4;  
        self.number_of_targets = 0
        self.F_conv_output = 10;  
        self.F_noconv_output = 10
        self.F_gconv_output_rate = 1;  
        self.F_lin_output = 10
        self.F_id_output_rate = 1;  
        self.F_emb_output = 10
        self.mlp_ratio = 1;  
        self.predictor = 'Default';  
        self.predictor_dropout = 0.1
        self.temporal_gate = False;  
        self.channel_sparsity = False
        self.label_len = 168;  
        self.single_tmpf = False
        # add any missing attrs your predictor needs
        self.dropout = 0.1;  
        self.output_attention = False
        self.continuity_beta = 1
        self.d_model = 128;  
        self.n_heads = 8;  
        self.d_ff = 64;  
        self.activation = 'gelu'