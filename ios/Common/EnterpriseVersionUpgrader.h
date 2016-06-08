//
//  EnterpriseVersionUpgrader.h
//  iAP
//
//  Created by yixiaoluo on 14-3-17.
//  Copyright (c) 2014年 gikoo.cn. All rights reserved.
//

#import <Foundation/Foundation.h>

#define Enterprise_Cache_Name  @"Enterprise_Cache_Name"

@interface EnterpriseVersionUpgrader : NSObject

+ (void)registerEnterpriseVersionUpgrade;

@end
