import pandas as pd
import numpy as np
pd.set_option('display.max_columns', None)
yelp_tip = "./data/raw_data/yelp_tip.csv"
yelp_tip_df = pd.read_csv(yelp_tip)
yelp_tip_df = yelp_tip_df.dropna()
yelp_tip_df = yelp_tip_df.reset_index()
print(yelp_tip_df)
yelp_tip_df.to_csv('./data/cleaned_data/yelp_tip_cleaned.csv',index=False)