//
//  GkRequestBase.m
//  Gikoo5
//
//  Created by 彭贝 on 15/10/9.
//  Copyright © 2015年 gikoo. All rights reserved.
//

#import "GKRequestBase.h"
#import "HTTPClient.h"
#import "GKRequestBase+Utils.h"

@interface GKRequestBase ()

@property (nonatomic, strong) NSDictionary* params;

@end

@implementation GKRequestBase

+ (id)requestBlock:(RequestBlock) block; {
    return [[self alloc]initWithBlock:block];
}

+ (id)requestWithParam:(NSDictionary*)param {
    return [[self alloc]initWithParam:param];
}

+ (id)requestWithParam:(NSDictionary*)param block:(RequestBlock) block {
    return [[self alloc]initWithParam:param block:block];
}

- (id)initWithBlock:(RequestBlock) block {
    if (self = [super init]) {
        self.block = block;
        [self start];
    }
    
    return self;
}

- (id)initWithParam:(NSDictionary*)param {
    return [self initWithParam:param block:nil];
}

- (id)initWithParam:(NSDictionary*)param block:(RequestBlock) block {
    self.params = param;
    return [self initWithBlock:block];
}

- (NSString*) removeUrlPrefix:(NSString*)url {
    while ([[url substringToIndex:1] isEqualToString:@"/"]) {
        url = [url substringFromIndex:1];
    }
    
    return url;
}

- (NSString*) removeUrlSuffix:(NSString*)url {
    while ([[url substringFromIndex:url.length-1] isEqualToString:@"/"]) {
        url = [url substringToIndex:url.length-1];
    }
    
    return url;
}

- (id)start {
    dispatch_async(dispatch_get_main_queue(), ^{
        NSString* domain = [self domain];
        NSString* prefix = [self prefixUrl];
        NSString* suburl = [self subUrl];
        
        domain = [self removeUrlSuffix:domain];
        
        prefix = [self removeUrlPrefix:prefix];
        prefix = [self removeUrlSuffix:prefix];
        
        suburl = [self removeUrlPrefix:suburl];
        
        GKRequestMethod method = [self method];
        NSDictionary* param = [self param];
        
        NSString* url = [NSString stringWithFormat:@"%@/%@/%@", domain, prefix, suburl];
        if (method == GKRequestMethodGet && param) {
            url = [url stringByAppendingString:[self paramToUrlString:param]];
        }
        
        void(^checkResponse)(NSHTTPURLResponse*) = ^(NSHTTPURLResponse* response) {
//            if (![GKUserUtils isLogin]) {
//                return;
//            }
            
            NSInteger code = response.statusCode;
            
            if (code == 401 || code == 403) {
//                [GKUserUtils logout];
//                
//                UIAlertView* alert = [UIAlertView bk_alertViewWithTitle:@"当前会话已失效，请重新登录！"];
//                
//                [alert bk_addButtonWithTitle:@"好的" handler:^{
//                    [GKUserUtils showLoginWithSuccessBlock:nil CompleteInformationBlock:nil];
//                }];
//                
//                [alert show];
            }
        };
        
        void(^onSuccess)(NSURLSessionDataTask*, NSDictionary*, NSError*) = ^(NSURLSessionDataTask* session, NSDictionary* result, NSError* error) {
            if (self.block) {
                NSDictionary *dic = [self result:result];
                self.block(dic, error);
            }
            
            checkResponse((NSHTTPURLResponse*)session.response);
        };
        
        void(^onFailed)(NSURLSessionDataTask*, NSDictionary*, NSError*) = ^(NSURLSessionDataTask* response, NSDictionary* result, NSError* error) {
            NSLog(@"*** Request Failed: %@", error.description);
            
            if (self.block) {
                self.block(result, error);
            }
            
            checkResponse((NSHTTPURLResponse*)response.response);
        };
        
        if (method == GKRequestMethodPost) {
            [[HTTPClient client] POST:url parameters:param success:^(NSURLSessionDataTask *task, id responseObject) {
                onSuccess(task, responseObject, nil);
            } failure:^(NSURLSessionDataTask *task, NSError *error) {
                onFailed(task, nil, error);
            }];
        }
        else if (method == GKRequestMethodGet) {
            [[HTTPClient client] GET:url parameters:nil success:^(NSURLSessionDataTask *task, id responseObject) {
                onSuccess(task, responseObject, nil);
            } failure:^(NSURLSessionDataTask *task, NSError *error) {
                onFailed(task, nil, error);
            }];
        }
        else if (method == GKRequestMethodDelete) {
            [[HTTPClient client] DELETE:url parameters:param success:^(NSURLSessionDataTask *task, id responseObject) {
                onSuccess(task, responseObject, nil);
            } failure:^(NSURLSessionDataTask *task, NSError *error) {
                onFailed(task, nil, error);
            }];
        }
        else if (method == GKRequestMethodPut) {
            [[HTTPClient client] PUT:url parameters:param success:^(NSURLSessionDataTask *task, id responseObject) {
                onSuccess(task, responseObject, nil);
            } failure:^(NSURLSessionDataTask *task, NSError *error) {
                
                onFailed(task, nil, error);
            }];
        }
    });
    
    return self;
}

#pragma mark Method to be implementation
- (NSString*) subUrl {
    return @"";
}

- (NSString*) prefixUrl {
    return @"api/v1";
}

- (NSString*) domain {
    return @"http://job.gikoo.cn";
}

- (GKRequestMethod) method {
    return GKRequestMethodPost;
}

- (NSDictionary*) param {
    return self.params;
}

- (NSDictionary*) result:(NSDictionary*)json {
    return json;
}

@end
