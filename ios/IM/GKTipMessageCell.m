//
//  GKTipMessageCell.m
//  RNRecruiterProj
//
//  Created by 彭 on 16/5/13.
//  Copyright © 2016年 Gikoo. All rights reserved.
//

#import "GKTipMessageCell.h"
#import "EaseBubbleView+Custom.h"
#import "GKTipMessageModel.h"

@interface GKTipMessageCell ()

@property (nonatomic, strong) GKTipMessageModel* tipModel;
@property (nonatomic, strong) UILabel* tipLabel;

@end

@implementation GKTipMessageCell

- (instancetype)initWithStyle:(UITableViewCellStyle)style
              reuseIdentifier:(NSString *)reuseIdentifier
                        model:(id<IMessageModel>)model {
    if (self = [super initWithStyle:style reuseIdentifier:reuseIdentifier model:model]) {
        self.tipModel = model;
        self.backgroundColor = [UIColor clearColor];
        
        [self buildTipLabel];
    }
    return self;
}

- (void)buildTipLabel {
    self.tipLabel = [[UILabel alloc]init];
    
    self.tipLabel.numberOfLines = 0;
    self.tipLabel.font = [UIFont systemFontOfSize:12];
    self.tipLabel.textColor = [UIColor colorFromHexString:@"bbbbbb"];
    self.tipLabel.textAlignment = NSTextAlignmentCenter;
    
    self.tipLabel.text = self.tipModel.tip;
    
    [self addSubview:self.tipLabel];
    [self.tipLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.edges.mas_equalTo(UIEdgeInsetsMake(20, 30, 0, 30));
    }];
}

- (BOOL)isCustomBubbleView:(id<IMessageModel>)model
{
    return YES;
}

- (void)setCustomModel:(id<IMessageModel>)model
{
    //    UIImage *image = model.image;
    //    if (!image) {
    //        [self.bubbleView.imageView sd_setImageWithURL:[NSURL URLWithString:model.fileURLPath] placeholderImage:[UIImage imageNamed:model.failImageName]];
    //    } else {
    //        _bubbleView.imageView.image = image;
    //    }
    //
    //    if (model.avatarURLPath) {
    //        [self.avatarView sd_setImageWithURL:[NSURL URLWithString:model.avatarURLPath] placeholderImage:model.avatarImage];
    //    } else {
    //        self.avatarView.image = model.avatarImage;
    //    }
}

- (void)setCustomBubbleView:(id<IMessageModel>)model
{
    [_bubbleView setupCustomBubbleView];
    
    _bubbleView.imageView.image = [UIImage imageNamed:@"imageDownloadFail"];
}

- (void)updateCustomBubbleViewMargin:(UIEdgeInsets)bubbleMargin model:(id<IMessageModel>)model
{
    [_bubbleView updateCustomMargin:bubbleMargin];
}

+ (NSString *)cellIdentifierWithModel:(id<IMessageModel>)model
{
    return @"GKTipMessageCell";
}

+ (CGFloat)cellHeightWithModel:(id<IMessageModel>)model
{
    GKTipMessageModel* tipModel = model;
    
    CGRect rect = [tipModel.tip boundingRectWithSize:CGSizeMake([UIScreen mainScreen].bounds.size.width - 30*2, CGFLOAT_MAX) options:(NSStringDrawingUsesLineFragmentOrigin | NSStringDrawingUsesFontLeading) attributes:@{NSFontAttributeName: [UIFont systemFontOfSize:12]} context:nil];
    
    return rect.size.height + 20;
}

@end
