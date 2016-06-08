//
//  GKUserUtils.h
//  RNRecruiterProj
//
//  Created by 彭 on 16/5/3.
//  Copyright © 2016年 Gikoo. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface GKUserUtils : NSObject
SYNTHESIZE_SINGLETON_FOR_HEADER(GKUserUtils)

+ (BOOL)isLogin;
+ (void)logout;

@end
