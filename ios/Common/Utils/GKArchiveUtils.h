//
//  GKArchiveUtils.h
//  Gikoo5
//
//  Created by 彭贝 on 15/11/9.
//  Copyright © 2015年 gikoo. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface GKArchiveUtils : NSObject

+ (BOOL)save:(id)object Key:(NSString*)key;
+ (id)loadWithKey:(NSString*)key;
+ (BOOL)deleteWithKey:(NSString*)key;

+ (BOOL)deleteAll;

@end
