//
//  GKUserInfoModel.h
//  RNRecruiterProj
//
//  Created by 彭 on 16/5/16.
//  Copyright © 2016年 Gikoo. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface GKUserInfoModel : NSObject

@property (strong) NSString* token;
@property (strong) NSString* username;
@property (strong) NSString* password;

@property (strong) NSString* real_name;
@property (strong) NSString* org_name;
@property (strong) NSString* org_id;
@property (strong) NSString* company_name;
@property (strong) NSString* company_id;
@property (strong) NSString* icon;
@property (strong) NSString* account_name;
@property (strong) NSString* store_id;
@property (strong) NSString* role_name;
@property (strong) NSString* u_id;
@property (strong) NSString* ue_id;
@property (strong) NSString* email;
@property (strong) NSString* phone;
@property (strong) NSNumber* gender;

@end
