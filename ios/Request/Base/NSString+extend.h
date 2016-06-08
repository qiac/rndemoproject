//
//  NSString+extend.h
//  mobokart
//
//  Created by etouch on 14-9-23.
//  Copyright (c) 2014年 etouch. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NSString(extend)
/*URL编码*/
-(NSString *)URLEncodedString;

- (CGSize)getTextSizeWithFont:(CGFloat)fontSize;
- (CGSize)getTextSizeWithFont:(CGFloat)fontSize maxSize:(CGSize)maxSize;

+ (NSString *)finalPriceWithPriceValue:(NSString*)priceValue;

- (NSString *)urlencode;
- (NSString *)urldecode;
- (NSDictionary *)URLParams;
- (NSMutableDictionary *)stringParams;
- (NSURL*)urlJumpHandle;
- (NSURL*)urlWithString;
//检查密码格式
+(BOOL)validatepwd:(NSString *)candidate;
//检查邮箱格式
+(BOOL)validateEmail:(NSString *)candidate;
+(BOOL)checkTel:(NSString *)candidate;
//判断字符串是否为空字符的方法
- (BOOL) isBlankString ;
/**
 *  解析url参数
 *
 *  @param CS
 *  @param webaddress
 *
 *  @return
 */
-(NSString *) analyzeUrlParam:(NSString *)param;

- (BOOL)isPhoneNumber;

@end
 