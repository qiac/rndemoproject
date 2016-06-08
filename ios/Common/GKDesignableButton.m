//
//  GKDesignableButton.m
//  RNRecruiterProj
//
//  Created by 彭 on 16/5/12.
//  Copyright © 2016年 Gikoo. All rights reserved.
//

#import "GKDesignableButton.h"

@implementation GKDesignableButton

- (void)setCornerRadius:(CGFloat)radius {
    self.layer.cornerRadius = radius;
}

- (CGFloat)cornerRadius {
    return self.layer.cornerRadius;
}

- (void)setBorderWidth:(CGFloat)borderWidth {
    self.layer.borderWidth = borderWidth;
}

- (CGFloat)borderWidth {
    return self.layer.borderWidth;
}

- (void)setBorderColor:(UIColor *)borderColor {
    self.layer.borderColor = borderColor.CGColor;
}

- (UIColor *)borderColor {
    return [UIColor colorWithCGColor:self.layer.borderColor];
}

@end
