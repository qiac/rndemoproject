//
//  GkRequestBase.h
//  Gikoo5
//
//  Created by 彭贝 on 15/10/9.
//  Copyright © 2015年 gikoo. All rights reserved.
//

#import <Foundation/Foundation.h>
//#import "MTLJSONAdapter.h"

typedef void (^RequestBlock)(NSDictionary* result, NSError* error);

typedef enum : NSUInteger {
    GKRequestMethodGet,
    GKRequestMethodPost,
    GKRequestMethodPut,
    GKRequestMethodDelete,
} GKRequestMethod;

@interface GKRequestBase : NSObject

+ (id)requestBlock:(RequestBlock) block;
+ (id)requestWithParam:(NSDictionary*)param;
+ (id)requestWithParam:(NSDictionary*)param block:(RequestBlock) block;

@property (nonatomic, copy) void(^block)(NSDictionary* result, NSError* error);

- (id)initWithBlock:(RequestBlock) block;
- (id)initWithParam:(NSDictionary*)param;
- (id)initWithParam:(NSDictionary*)param block:(RequestBlock) block;

#pragma mark 必须继承的方法
// 子url
- (NSString*) subUrl;

#pragma mark 按需继承的方法
// url前缀，默认: /api/v1
- (NSString*) prefixUrl;

// 域名
- (NSString*) domain;

// 请求的方法，默认为POST
- (GKRequestMethod) method;

// 参数，默认为nil
- (NSDictionary*) param;

// 将json数据转换成需要的数据，默认不转换
- (NSDictionary*) result:(NSDictionary*)json;

@end
