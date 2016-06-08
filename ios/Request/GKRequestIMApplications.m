//
//  GKRequestImApplications.m
//  Recruiter
//
//  Created by rock on 16/4/15.
//  Copyright © 2016年 DCloud. All rights reserved.
//

#import "GKRequestImApplications.h"

@implementation GKRequestImApplications

+ (id)requestWithAppIds:(NSArray*)appIds block:(RequestBlock)block {

    return [[GKRequestImApplications alloc]initWithParam:@{@"app_ids":[GKRequestImApplications toJSONString:appIds]} block:block];
}

- (NSString *)subUrl {
    return @"/recruit/im/applications/";
}

- (GKRequestMethod)method {
    return GKRequestMethodGet;
}

- (NSString*) prefixUrl {
    return @"api/v1";
}

+ (NSString *)toJSONString:(NSArray*)theData
{
    if (!theData.count) {
        return @"[]";
    }
    NSString *jsonString = @"[";
    for (NSString *str in theData) {
        jsonString = [NSString stringWithFormat:@"%@\"%@\",",jsonString,str];
    }
    jsonString = [jsonString substringToIndex:jsonString.length-1];
    jsonString = [NSString stringWithFormat:@"%@]",jsonString];
    return jsonString;
}
@end
