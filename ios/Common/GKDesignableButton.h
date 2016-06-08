//
//  GKDesignableButton.h
//  RNRecruiterProj
//
//  Created by 彭 on 16/5/12.
//  Copyright © 2016年 Gikoo. All rights reserved.
//

#import <UIKit/UIKit.h>

IB_DESIGNABLE
@interface GKDesignableButton : UIButton

@property IBInspectable CGFloat cornerRadius;
@property IBInspectable CGFloat borderWidth;
@property IBInspectable UIColor* borderColor;

@end
