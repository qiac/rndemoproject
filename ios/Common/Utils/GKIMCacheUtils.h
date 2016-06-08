//
//  GKIMCacheUtils.h
//  RNRecruiterProj
//
//  Created by 彭 on 16/5/3.
//  Copyright © 2016年 Gikoo. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface GKIMCacheUtils : NSObject

+ (NSString*)avatarFromChatter:(NSString*)chatter;
+ (NSString*)displayNameFromChatter:(NSString*)chatter;
+ (NSString*)passwordFromChatter:(NSString*)chatter;

+ (void)setChatter:(NSString*)chatter withAvatar:(NSString*)avatar;
+ (void)setChatter:(NSString*)chatter withDisplayName:(NSString*)displayName;
+ (void)setChatter:(NSString*)chatter withPassword:(NSString*)password;

@end
