//
//  GKIMUtils.m
//  RNRecruiterProj
//
//  Created by 彭 on 16/5/3.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "GKIMUtils.h"

@implementation GKIMUtils

+ (BOOL)isLogin {
    return [EMClient sharedClient].options.isAutoLogin;
}

+ (void)loginWithUsername:(NSString *)aUsername password:(NSString *)aPassword block:(void(^)(BOOL success))block {
    if ([GKIMUtils isLogin]) {
        if ([[EMClient sharedClient].currentUsername isEqualToString:aUsername]) {
            return;
        }
        
        [[EMClient sharedClient] logout:YES];
    }
    
    dispatch_async(GLOBAL_QUEUE, ^{
        EMError *error = [[EMClient sharedClient] loginWithUsername:aUsername password:aPassword];
        BOOL success = NO;
        if (!error) {
            [[EMClient sharedClient].options setIsAutoLogin:YES];
            success = YES;
        }
        
        dispatch_sync(MAIN_QUEUE, ^{
            block(success);
        });
    });
    
    return;
}

+ (void)logout {
    [[EMClient sharedClient] logout:YES];
    
    [GKStorageVariableUtils sharedGKStorageVariableUtils].username = @"";
    [GKStorageVariableUtils sharedGKStorageVariableUtils].password = @"";
}

@end
