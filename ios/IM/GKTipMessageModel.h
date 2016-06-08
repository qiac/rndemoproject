//
//  GKTipMessageModel.h
//  RNRecruiterProj
//
//  Created by 彭 on 16/5/13.
//  Copyright © 2016年 Gikoo. All rights reserved.
//

#import "EaseMessageModel.h"

@interface GKTipMessageModel : EaseMessageModel

@property (nonatomic, strong) NSString* tip;

- (instancetype)initWithTip:(NSString*)tip;

@end
