//
//  GKTipMessageModel.m
//  RNRecruiterProj
//
//  Created by 彭 on 16/5/13.
//  Copyright © 2016年 Gikoo. All rights reserved.
//

#import "GKTipMessageModel.h"

@implementation GKTipMessageModel

- (instancetype)initWithTip:(NSString*)tip {
    if (self = [super init]) {
        self.tip = tip;
    }
    return self;
}

@end
