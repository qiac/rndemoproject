//
//  GKRequestImApplications.h
//  Recruiter
//
//  Created by rock on 16/4/15.
//  Copyright © 2016年 DCloud. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "GKRequestBase.h"

@interface GKRequestImApplications : GKRequestBase
+ (id)requestWithAppIds:(NSArray*)appIds block:(RequestBlock)block;
@end
