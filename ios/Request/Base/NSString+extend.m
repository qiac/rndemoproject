//
//  NSString+extend.m
//  mobokart
//
//  Created by etouch on 14-9-23.
//  Copyright (c) 2014年 etouch. All rights reserved.
//

#import "NSString+extend.h"

@implementation NSString(extend)

-(NSString *)URLEncodedString{
    NSString *result = (NSString *)CFURLCreateStringByAddingPercentEscapes(kCFAllocatorDefault, (CFStringRef)self, NULL, CFSTR("!*'();:@&=+$,/?%#[]"), kCFStringEncodingUTF8);
    [result autorelease];
    return result;
}

- (CGSize)getTextSizeWithFont:(CGFloat)fontSize;
{
    CGSize size = CGSizeZero;
    if (self.length > 0)
    {
        if ([self respondsToSelector:@selector(sizeWithAttributes:)])
        {
            size = [self sizeWithAttributes:@{NSFontAttributeName: [UIFont systemFontOfSize:fontSize]}];
        }
        else
        {
            size = [self sizeWithFont:[UIFont systemFontOfSize:fontSize]];
        }
    }
    return CGSizeMake(ceilf(size.width), ceilf(size.height));
}

- (CGSize)getTextSizeWithFont:(CGFloat)fontSize maxSize:(CGSize)maxSize
{
    //    [text
    //     boundingRectWithSize:maxSize options:(NSStringDrawingUsesLineFragmentOrigin)
    //     attributes:@{NSFontAttributeName:font} context:nil].size
    
//    size = [self sizeWithFont:[UIFont systemFontOfSize:fontSize] constrainedToSize:maxSize lineBreakMode:NSLineBreakByCharWrapping];
    CGSize size = CGSizeZero;
    if (self.length > 0)
    {
        if ([self respondsToSelector:@selector(sizeWithAttributes:)])
        {
            size = [self boundingRectWithSize:maxSize options:NSStringDrawingUsesLineFragmentOrigin attributes:@{NSFontAttributeName: [UIFont systemFontOfSize:fontSize]} context:nil].size;
        }
        else
        {
            size = [self sizeWithFont:[UIFont systemFontOfSize:fontSize] constrainedToSize:maxSize lineBreakMode:NSLineBreakByCharWrapping];
        }

    }
    return CGSizeMake(ceilf(size.width), ceilf(size.height));
}

+ (NSString *)finalPriceWithPriceValue:(NSString*)priceValue
{
    if (priceValue.length > 0)
    {
        float priceNow = [priceValue floatValue];
        return [NSString stringWithFormat:@"￥%.2f",priceNow];
    }
    else
    {
        return nil;
    }
}

#pragma mark URL

- (NSString *)urldecode {
    return [self stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
}
//NSString * encodingString = [urlString stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];


- (NSString *)urlencode {
	NSString *encUrl = [self stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    //    NSDate* tmpStartData = [NSDate date];
//    NSArray *escapeChars = [NSArray arrayWithObjects:@";" , @"/" , @"?" , @":" ,
//                            @"@" , @"&" , @"=" , @"+" , @"$" , @",",@"!", @"'", @"(", @")", @"*", @"#", @"~", @"[", @"]", nil];
//    NSArray*replaceChars = [NSArray arrayWithObjects:@"%3B" , @"%2F", @"%3F" , @"%3A" ,
//                            @"%40" , @"%26" , @"%3D" , @"%2B" , @"%24" , @"%2C",@"%21", @"%27", @"%28", @"%29", @"%2A", @"%23", @"%7E", @"%5B", @"%5D", nil];
//    
//    NSInteger len = [escapeChars count];
//    NSMutableString *temp = [NSMutableString stringWithString:encUrl];
//    for (int i = 0; i < len; i++) {
//        [temp replaceOccurrencesOfString:[escapeChars objectAtIndex:i]
//                              withString:[replaceChars objectAtIndex:i]
//                                 options:NSLiteralSearch
//                                   range:NSMakeRange(0, [temp length])];
//    }
	return [NSString stringWithString:encUrl];
}



- (NSDictionary *)URLParams
{
	NSMutableDictionary* pairs = [NSMutableDictionary dictionary];
    NSString *paramString = nil;
	if (NSNotFound != [self rangeOfString:@"?"].location) {
        paramString = [self substringFromIndex:
                       ([self rangeOfString:@"?"].location + 1)];
	}
    else
    {
        paramString = self;
    }
    NSCharacterSet* delimiterSet = [NSCharacterSet characterSetWithCharactersInString:@"&"];
    NSScanner* scanner = [[NSScanner alloc] initWithString:paramString];
    while (![scanner isAtEnd]) {
        NSString* pairString = nil;
        [scanner scanUpToCharactersFromSet:delimiterSet intoString:&pairString];
        [scanner scanCharactersFromSet:delimiterSet intoString:NULL];
        NSArray* kvPair = [pairString componentsSeparatedByString:@"="];
        if (kvPair.count == 2) {
            NSString* key = [[kvPair objectAtIndex:0] urldecode];
            NSString* value = [[kvPair objectAtIndex:1] urldecode];
            [pairs setValue:value forKey:key];
        }
    }
	
	return [NSDictionary dictionaryWithDictionary:pairs];
}


- (NSMutableDictionary *)stringParams
{
	NSMutableDictionary* pairs = [NSMutableDictionary dictionary];
    NSCharacterSet* delimiterSet = [NSCharacterSet characterSetWithCharactersInString:@"&"];
    NSScanner* scanner = [[NSScanner alloc] initWithString:self];
    while (![scanner isAtEnd]) {
        NSString* pairString = nil;
        [scanner scanUpToCharactersFromSet:delimiterSet intoString:&pairString];
        NSLog(@"===:%@",pairString);
        [scanner scanCharactersFromSet:delimiterSet intoString:NULL];
        NSArray* kvPair = [pairString componentsSeparatedByString:@"="];
        
        NSLog(@"%@",kvPair);
        if (kvPair.count == 2) {
            NSString* key = [[kvPair objectAtIndex:0] urldecode];
            NSString* value = [[kvPair objectAtIndex:1] urldecode];
            [pairs setValue:value forKey:key];
        }else if (kvPair.count>2){//如果有存在多个=号
            NSString* key = [[kvPair objectAtIndex:0] urldecode];
            NSString *value=[[kvPair objectAtIndex:1] urldecode];
            
            for (int i=2;i<kvPair.count;i++) {
                if (![@"" isEqualToString:[kvPair objectAtIndex:i]]&&[kvPair objectAtIndex:i]!=nil) {
                    value=[value stringByAppendingString:[NSString stringWithFormat:@"=%@",[[kvPair objectAtIndex:i] urldecode]]];
                }else{
                    value=[value stringByAppendingString:@"="];
                }
            }
            [pairs setValue:value forKey:key];
        }
    }
    
    [scanner release];
    NSLog(@"%@",pairs);
	return pairs;
}

//服务器返回的url如果含有中文字符需要处理
-(NSURL*)urlJumpHandle{
    self=[self stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    NSURL *url=[NSURL URLWithString:[self stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding]];
    return url;
}

-(NSURL*)urlWithString{
    return [NSURL URLWithString:self];
}
//检测密码
+(BOOL)validatepwd:(NSString *)candidate{
    if (candidate.length<6) {
        return false;
    }
    NSString *emailRegex = @"^[a-zA-Z0-9]{6,20}$";
    NSPredicate *emailTest = [NSPredicate predicateWithFormat:@"SELF MATCHES %@", emailRegex];
    return [emailTest evaluateWithObject:candidate];
    
}
//检测邮箱
+(BOOL)validateEmail:(NSString *)candidate{
    NSString *emailRegex = @"[A-Z0-9a-z_.]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}";
    NSPredicate *emailTest = [NSPredicate predicateWithFormat:@"SELF MATCHES %@", emailRegex];
    NSCharacterSet *nameCharacters = [[NSCharacterSet characterSetWithCharactersInString:@"._-@abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"] invertedSet];
    NSRange userNameRange = [candidate rangeOfCharacterFromSet:nameCharacters];
    
    return [emailTest evaluateWithObject:candidate] && (userNameRange.location != NSNotFound?NO:YES);
}
//检测电话号码
+(BOOL)checkTel:(NSString *)candidate{
    NSString *telNumRegex = @"^\\d{11}$";
    NSPredicate *telNumTest = [NSPredicate predicateWithFormat:@"SELF MATCHES %@", telNumRegex];
    return [telNumTest evaluateWithObject:candidate];
    
}
//判断字符串是否为空字符的方法
- (BOOL) isBlankString {
    if (self == nil || self == NULL) {
        return YES;
    }
    if ([self isKindOfClass:[NSNull class]]) {
        return YES;
    }
    if ([[self stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]] length]==0) {
        return YES;
    }
    return NO;
}

/**
 *  解析url参数
 *
 *  @param CS
 *  @param webaddress
 *
 *  @return
 */
-(NSString *) analyzeUrlParam:(NSString *)param{
    NSError *error;
    NSString *regTags=[[NSString alloc] initWithFormat:@"(^|&|\\?)+%@=+([^&]*)(&|$)",param];
    NSRegularExpression *regex = [NSRegularExpression regularExpressionWithPattern:regTags
                                                                           options:NSRegularExpressionCaseInsensitive
                                                                             error:&error];
    // 执行匹配的过程
    NSArray *matches = [regex matchesInString:self options:0 range:NSMakeRange(0, [self length])];
    for (NSTextCheckingResult *match in matches) {
        NSString *tagValue = [self substringWithRange:[match rangeAtIndex:2]];  // 分组2所对应的串
        return tagValue;
    }
    return @"";
}

// 检测电话号码是否正确
- (BOOL)isPhoneNumber
{
    NSString* re = @"^[1][0-9][0-9]{9}$";
    NSPredicate *emailTest = [NSPredicate predicateWithFormat:@"SELF MATCHES %@", re];
    return [emailTest evaluateWithObject:self];
}

@end
