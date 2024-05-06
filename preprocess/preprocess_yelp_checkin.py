import pandas as pd
import numpy as np
pd.set_option('display.max_columns', None)
yelp_checkin = "./data/raw_data/yelp_checkin.csv"
yelp_checkin_df = pd.read_csv(yelp_checkin)
yelp_checkin_df.to_csv('./data/cleaned_data/yelp_checkin_cleaned.csv',index=False)
print(yelp_checkin_df.info())