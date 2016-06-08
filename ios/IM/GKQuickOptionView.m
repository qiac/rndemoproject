//
//  GKQuickOptionView.m
//  RNRecruiterProj
//
//  Created by 彭 on 16/5/12.
//  Copyright © 2016年 Gikoo. All rights reserved.
//

#import "GKQuickOptionView.h"

@implementation GKQuickOptionView

+ (id)viewFromNib
{
    return [[[NSBundle mainBundle] loadNibNamed:NSStringFromClass(self) owner:nil options:nil] objectAtIndex:0];
}

- (instancetype)init
{
    self = [[self class]viewFromNib];
    if (self) {
        
    }
    return self;
}

- (void)awakeFromNib
{
    [super awakeFromNib];
}



@end
