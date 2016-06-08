//
//  GKIMUtils.h
//  RNRecruiterProj
//
//  Created by 彭 on 16/5/3.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface GKIMUtils : NSObject

+ (BOOL)isLogin;
+ (void)loginWithUsername:(NSString *)aUsername password:(NSString *)aPassword block:(void(^)(BOOL success))block;
+ (void)logout;

@end
