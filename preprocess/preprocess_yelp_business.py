import pandas as pd
import numpy as np
pd.set_option('display.max_columns', None)
yelp_business = "./data/raw_data/yelp_business.csv"
yelp_business_df = pd.read_csv(yelp_business)
yelp_business_df = yelp_business_df.drop(columns=['neighborhood'])
yelp_business_df['categories'] = yelp_business_df['categories'].apply(lambda x: [f.replace('[','').replace(']','') for f in x.split(';')])
yelp_business_df['name'] = yelp_business_df['name'].apply(lambda x: x.replace('"',''))
yelp_business_df['address'] = yelp_business_df['address'].apply(lambda x: x.replace('"',''))
yelp_categories_df = yelp_business_df.explode('categories')
yelp_business_df = yelp_business_df.drop(columns=['categories','latitude','longitude','postal_code'])
yelp_business_df = yelp_business_df.reset_index()
yelp_business_df = yelp_business_df.drop(columns=['index'])
yelp_categories_df = yelp_categories_df[['business_id','categories']]
yelp_categories_df = yelp_categories_df.reset_index()
yelp_categories_df = yelp_categories_df.drop(columns=['index'])
print(yelp_business_df.head())
yelp_business_df.to_csv('./data/cleaned_data/yelp_business_cleaned.csv',index=False)
yelp_categories_df.to_csv('./data/cleaned_data/yelp_categories_cleaned.csv',index=False)