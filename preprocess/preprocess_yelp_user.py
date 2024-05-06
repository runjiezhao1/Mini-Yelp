import pandas as pd
import numpy as np
pd.set_option('display.max_columns', None)
yelp_user = "./data/raw_data/yelp_user.csv"
yelp_user_df = pd.read_csv(yelp_user)
yelp_user_df = yelp_user_df.drop(columns=['useful','funny','cool','fans','elite','compliment_hot'
                                          ,'compliment_more','compliment_profile','compliment_cute'
                                          ,'compliment_list','compliment_note','compliment_plain'
                                          ,'compliment_cool','compliment_funny','compliment_writer'
                                          ,'compliment_photos'])
yelp_user_df['friends'] = yelp_user_df['friends'].apply(lambda x: [f.replace('[','').replace(']','') for f in x.split(',')])
#new table with friends
yelp_friend_df = yelp_user_df.explode('friends')

yelp_user_df = yelp_user_df.drop(columns=['friends'])
yelp_user_df = yelp_user_df.reset_index()
yelp_user_df = yelp_user_df.drop(columns=['index'])
print(yelp_user_df)
yelp_user_df.to_csv('./data/cleaned_data/yelp_user_cleaned.csv',index=False)