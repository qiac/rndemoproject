//
//  GKCustomMessageCell.m
//  RNRecruiterProj
//
//  Created by 彭 on 16/5/10.
//  Copyright © 2016年 Gikoo. All rights reserved.
//

#import "GKCustomMessageCell.h"

@implementation GKCustomMessageCell

+ (void)initialize
{
    // UIAppearance Proxy Defaults
    EaseBaseMessageCell *cell = [self appearance];

    cell.messageNameIsHidden = YES;
}

@end
