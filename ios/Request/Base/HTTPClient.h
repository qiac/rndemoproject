//
//  HTTPClient.h
//  Gikoo5
//
//  Created by EricChen on 15/9/17.
//  Copyright (c) 2015年 gikoo. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "AFNetworking.h"

/**
 * 在AFHTTPSessionManager外面包一层，可以实现在取消所有任务之后继续使用该实例
 */
@interface HTTPClient : NSObject

@property (nonatomic, strong, readonly) AFHTTPSessionManager *sessionManager;
@property (nonatomic, copy) NSDictionary *HTTPAdditionalHeaders;

+ (instancetype)client;

- (instancetype)initWithSessionConfiguration:(NSURLSessionConfiguration *)configuration;

- (NSURLSessionDataTask *)GET:(NSString *)URLString
                   parameters:(id)parameters
                      success:(void (^)(NSURLSessionDataTask *task, id responseObject))success
                      failure:(void (^)(NSURLSessionDataTask *task, NSError *error))failure;

- (NSURLSessionDataTask *)POST:(NSString *)URLString
                    parameters:(id)parameters
                       success:(void (^)(NSURLSessionDataTask *task, id responseObject))success
                       failure:(void (^)(NSURLSessionDataTask *task, NSError *error))failure;

- (NSURLSessionDataTask *)PUT:(NSString *)URLString
                   parameters:(id)parameters
                      success:(void (^)(NSURLSessionDataTask *task, id responseObject))success
                      failure:(void (^)(NSURLSessionDataTask *task, NSError *error))failure;

- (NSURLSessionDataTask *)DELETE:(NSString *)URLString
                      parameters:(id)parameters
                         success:(void (^)(NSURLSessionDataTask *task, id responseObject))success
                         failure:(void (^)(NSURLSessionDataTask *task, NSError *error))failure;

- (void)cancelAllTask;

@end
