import pandas as pd
import numpy as np
pd.set_option('display.max_columns', None)
yelp_user = "./data/cleaned_data/yelp_categories_cleaned.csv"
yelp_user_df = pd.read_csv(yelp_user)
print(yelp_user_df.info())