//
//  GKUserUtils.m
//  RNRecruiterProj
//
//  Created by 彭 on 16/5/3.
//  Copyright © 2016年 Gikoo. All rights reserved.
//

#import "GKUserUtils.h"
#import "GKStorageVariableUtils.h"
#import "GKIMUtils.h"

@implementation GKUserUtils
SYNTHESIZE_SINGLETON_FOR_CLASS(GKUserUtils)

+ (BOOL)isLogin {
    NSString* token = [GKStorageVariableUtils sharedGKStorageVariableUtils].token;
    
    return token != nil && token.length;
}

+ (void)logout {
    [GKIMUtils logout];
    
    [GKStorageVariableUtils sharedGKStorageVariableUtils].token = @"";
}

@end
