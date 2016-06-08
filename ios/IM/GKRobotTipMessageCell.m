//
//  GKRobotTipMessageCell.m
//  RNRecruiterProj
//
//  Created by 彭 on 16/5/10.
//  Copyright © 2016年 Gikoo. All rights reserved.
//

#import "GKRobotTipMessageCell.h"
#import "EaseBubbleView+Custom.h"

@implementation GKRobotTipMessageCell

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

//+ (NSString *)cellIdentifierWithModel:(id<IMessageModel>)model
//{
//    return model.isSender?@"EaseMessageCellSendGif":@"EaseMessageCellRecvGif";
//}
//
//+ (CGFloat)cellHeightWithModel:(id<IMessageModel>)model
//{
//    return 100;
//}

+ (NSString *)cellIdentifierWithModel:(id<IMessageModel>)model
{
    return @"GKRobotTipMessageCell";
}

+ (CGFloat)cellHeightWithModel:(id<IMessageModel>)model
{
    return 100;
}

@end
