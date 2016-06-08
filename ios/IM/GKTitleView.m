//
//  GKTitleView.m
//  RNRecruiterProj
//
//  Created by 彭 on 16/5/13.
//  Copyright © 2016年 Gikoo. All rights reserved.
//

#import "GKTitleView.h"

@interface GKTitleView ()

@property (nonatomic, strong)UILabel* titleLabel;
@property (nonatomic, strong)MASConstraint* titleTopConstraint;

@property (nonatomic, strong)UILabel* subTitleLabel;

@end

@implementation GKTitleView

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        [self buildViews];
    }
    return self;
}

- (void)buildViews {
    self.titleLabel = [[UILabel alloc]init];
    self.subTitleLabel = [[UILabel alloc]init];
    
    self.titleLabel.font = [UIFont systemFontOfSize:18];
    self.subTitleLabel.font = [UIFont systemFontOfSize:10];
    
    [self addSubview:self.titleLabel];
    [self addSubview:self.subTitleLabel];
    
    [self.titleLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerX.offset(0);
        self.titleTopConstraint = make.centerY;
    }];
    
    [self.subTitleLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerX.offset(0);
        make.top.equalTo(self.titleLabel.mas_bottom).offset(1);
    }];
}

- (void)setTitle:(NSString *)title {
    if (self.titleLabel) {
        self.titleLabel.text = title;
    }
}

- (void)setSubTitle:(NSString *)subTitle {
    if (self.subTitleLabel) {
        if (subTitle && subTitle.length) {
            self.titleTopConstraint.offset(-6);
        }
        else {
            self.titleTopConstraint.offset(0);
        }
        
        self.subTitleLabel.text = subTitle;
    }
}

@end
