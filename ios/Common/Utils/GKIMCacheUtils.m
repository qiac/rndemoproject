//
//  GKIMCacheUtils.m
//  RNRecruiterProj
//
//  Created by 彭 on 16/5/3.
//  Copyright © 2016年 Gikoo. All rights reserved.
//

#import "GKIMCacheUtils.h"
#import "GKArchiveUtils.h"

@implementation GKIMCacheUtils

+ (NSString*)avatarFromChatter:(NSString*)chatter {
    return [GKArchiveUtils loadWithKey:[NSString stringWithFormat:@"IM_Avatar_%@", chatter]];
}

+ (NSString*)displayNameFromChatter:(NSString*)chatter {
    return [GKArchiveUtils loadWithKey:[NSString stringWithFormat:@"IM_DisplayName_%@", chatter]];
}

+ (NSString*)passwordFromChatter:(NSString*)chatter {
    return [GKArchiveUtils loadWithKey:[NSString stringWithFormat:@"IM_Password_%@", chatter]];
}

+ (void)setChatter:(NSString*)chatter withAvatar:(NSString*)avatar {
    [GKArchiveUtils save:avatar Key:[NSString stringWithFormat:@"IM_Avatar_%@", chatter]];
}

+ (void)setChatter:(NSString*)chatter withDisplayName:(NSString*)displayName {
    [GKArchiveUtils save:displayName Key:[NSString stringWithFormat:@"IM_DisplayName_%@", chatter]];
}

+ (void)setChatter:(NSString*)chatter withPassword:(NSString*)password {
    [GKArchiveUtils save:password Key:[NSString stringWithFormat:@"IM_Password_%@", chatter]];
}

@end
