//
//  GKStorageVariableUtils.h
//  RNRecruiterProj
//
//  Created by 彭 on 16/5/3.
//  Copyright © 2016年 Gikoo. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface GKStorageVariableUtils : NSObject
SYNTHESIZE_SINGLETON_FOR_HEADER(GKStorageVariableUtils)

@property (strong) NSString* token;
@property (strong) NSString* username;
@property (strong) NSString* password;

@end
