//
//  GKStorageVariableUtils.m
//  RNRecruiterProj
//
//  Created by 彭 on 16/5/3.
//  Copyright © 2016年 Gikoo. All rights reserved.
//

#import "GKStorageVariableUtils.h"
#import "GKArchiveUtils.h"

@implementation GKStorageVariableUtils
SYNTHESIZE_SINGLETON_FOR_CLASS(GKStorageVariableUtils)

- (NSString*)token {
    return [GKArchiveUtils loadWithKey:@"token"];
}

- (void)setToken:(NSString *)token {
    [GKArchiveUtils save:token Key:@"token"];
}

- (NSString*)username {
    return [GKArchiveUtils loadWithKey:@"username"];
}

- (void)setUsername:(NSString *)username {
    [GKArchiveUtils save:username Key:@"username"];
}

- (NSString*)password {
    return [GKArchiveUtils loadWithKey:@"password"];
}

- (void)setPassword:(NSString *)password {
    [GKArchiveUtils save:password Key:@"password"];
}

@end
