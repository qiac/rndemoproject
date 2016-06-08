//
//  GKRequestBase+Utils.m
//  Gikoo5
//
//  Created by 彭贝 on 15/10/9.
//  Copyright © 2015年 gikoo. All rights reserved.
//

#import "GKRequestBase+Utils.h"

@implementation GKRequestBase (Utils)

- (NSString*)paramToUrlString:(NSDictionary*)param {
    NSMutableString *sRet = [[NSMutableString alloc] init];
    for (NSInteger i=0; i<[param count]; i++) {
        NSString *sKey = [param.allKeys objectAtIndex:i];
        NSString *sValue = param[sKey];
        if ([sValue isKindOfClass:[NSNumber class]]) {
            NSNumber *value = (NSNumber *)sValue;
            sValue = [value stringValue];
        }
        if (i==0) {
            [sRet appendString:@"?"];
        }
        else {
            [sRet appendString:@"&"];
        }
        
        [sRet appendFormat:@"%@=%@", sKey, sValue];
    }
    return sRet;
}

@end
