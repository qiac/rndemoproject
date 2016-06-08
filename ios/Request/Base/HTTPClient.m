//
//  HTTPClient.m
//  Gikoo5
//
//  Created by EricChen on 15/9/17.
//  Copyright (c) 2015年 gikoo. All rights reserved.
//

#import "HTTPClient.h"
#import "NSString+extend.h"

@interface HTTPClient ()

@property (nonatomic, strong) NSURLSessionConfiguration *configuration;
@property (nonatomic, strong, readwrite) AFHTTPSessionManager *sessionManager;

@end

@implementation HTTPClient

+ (instancetype)client
{
    return [[HTTPClient alloc] initWithSessionConfiguration:nil];
}

- (instancetype)initWithSessionConfiguration:(NSURLSessionConfiguration *)configuration
{
    if (self = [super init]) {
        self.configuration = configuration;
    }
    
    return self;
}

- (NSURLSessionDataTask *)GET:(NSString *)URLString
                   parameters:(id)parameters
                      success:(void (^)(NSURLSessionDataTask *task, id responseObject))success
                      failure:(void (^)(NSURLSessionDataTask *task, NSError *error))failure
{
//    NSString* encodedUrl = [URLString urlencode];
    
    NSString* encodedUrl = [URLString stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    
    return [self.sessionManager GET:encodedUrl parameters:parameters success:success failure:failure];
}

- (NSURLSessionDataTask *)POST:(NSString *)URLString
                    parameters:(id)parameters
                       success:(void (^)(NSURLSessionDataTask *task, id responseObject))success
                       failure:(void (^)(NSURLSessionDataTask *task, NSError *error))failure
{
    //    NSString* encodedUrl = [URLString urlencode];
    
    NSString* encodedUrl = [URLString stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    
    return [self.sessionManager POST:encodedUrl parameters:parameters success:success failure:failure];
}

- (NSURLSessionDataTask *)PUT:(NSString *)URLString
                   parameters:(id)parameters
                      success:(void (^)(NSURLSessionDataTask *task, id responseObject))success
                      failure:(void (^)(NSURLSessionDataTask *task, NSError *error))failure
{
    return [self.sessionManager PUT:[URLString urlencode] parameters:parameters success:success failure:failure];
}

- (NSURLSessionDataTask *)DELETE:(NSString *)URLString
                      parameters:(id)parameters
                         success:(void (^)(NSURLSessionDataTask *task, id responseObject))success
                         failure:(void (^)(NSURLSessionDataTask *task, NSError *error))failure
{
    return [self.sessionManager DELETE:[URLString urlencode] parameters:parameters success:success failure:failure];
}

- (void)cancelAllTask
{
    [self.sessionManager invalidateSessionCancelingTasks:YES];
    self.sessionManager = nil;
}

#pragma mark - Getter && Setter

- (AFHTTPSessionManager *)sessionManager
{
    if (!_sessionManager) {
        _sessionManager = [[AFHTTPSessionManager alloc] initWithSessionConfiguration:self.configuration];
        _sessionManager.requestSerializer = [AFJSONRequestSerializer serializer];
        _sessionManager.responseSerializer = [AFJSONResponseSerializer serializer];
    }
    
    NSMutableDictionary* header = [NSMutableDictionary new];

    if ([GKUserUtils isLogin]) {
        [header setObject:[NSString stringWithFormat:@"Token %@",[GKGlobalStorableVariable sharedGKGlobalStorableVariable].userInfo.token] forKey:@"Authorization"];
        [header setObject:[NSString stringWithFormat:@"%@",[GKGlobalStorableVariable sharedGKGlobalStorableVariable].userInfo.token] forKey:@"Token"];
    }
    
    return _sessionManager;
}

- (void)setHTTPAdditionalHeaders:(NSDictionary *)HTTPAdditionalHeaders
{
    _HTTPAdditionalHeaders = HTTPAdditionalHeaders;
    _configuration.HTTPAdditionalHeaders = HTTPAdditionalHeaders;
    _sessionManager.session.configuration.HTTPAdditionalHeaders = HTTPAdditionalHeaders;
}

@end
