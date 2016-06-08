//
//  GKArchiveUtils.m
//  Gikoo5
//
//  Created by 彭贝 on 15/11/9.
//  Copyright © 2015年 gikoo. All rights reserved.
//

#import "GKArchiveUtils.h"

@implementation GKArchiveUtils

+ (BOOL)save:(id)object Key:(NSString*)key {
    if (nil == object) {
        return [self deleteWithKey:key];
    }
    
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths objectAtIndex:0];
    NSString *filePath = [documentsDirectory stringByAppendingString:[NSString stringWithFormat:@"/%@.archive", key]];
    return [NSKeyedArchiver archiveRootObject:object toFile:filePath];
}

+ (id)loadWithKey:(NSString*)key {
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths objectAtIndex:0];
    NSString *filePath = [documentsDirectory stringByAppendingString:[NSString stringWithFormat:@"/%@.archive", key]];
    return [NSKeyedUnarchiver unarchiveObjectWithFile:filePath];
}

+ (BOOL)deleteWithKey:(NSString*)key {
    NSFileManager *fileManager = [NSFileManager defaultManager];
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths objectAtIndex:0];
    NSString *filePath = [documentsDirectory stringByAppendingString:[NSString stringWithFormat:@"/%@.archive", key]];
    return [fileManager removeItemAtPath:filePath error:NULL];
}

+ (BOOL)deleteAll {
    BOOL result = YES;
    NSFileManager *fileManager = [NSFileManager defaultManager];
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths objectAtIndex:0];
    
    NSArray *files = [fileManager contentsOfDirectoryAtPath:documentsDirectory error:NULL];
    
    for (int i = 0; i < [files count]; i++) {
        NSString *path = [files objectAtIndex:i];
        result = result && [fileManager removeItemAtPath:path error:NULL];
    }
    
    return result;
}

@end
