//
//  EnterpriseVersionUpgrader.m
//  iAP
//
//  Created by yixiaoluo on 14-3-17.
//  Copyright (c) 2014年 gikoo.cn. All rights reserved.
//

#import "EnterpriseVersionUpgrader.h"
#import "GKArchiveUtils.h"

BOOL alertDisplaying = NO;

@implementation EnterpriseVersionUpgrader

+ (void)registerEnterpriseVersionUpgrade
{
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(checkEnterpriseVersionAndTrigerUpgrade) name:UIApplicationWillEnterForegroundNotification object:nil];
    [[NSNotificationCenter defaultCenter] postNotificationName:UIApplicationWillEnterForegroundNotification object:nil];
}

+ (void)checkEnterpriseVersionAndTrigerUpgrade
{
    if (alertDisplaying) return;
    
    //设置下载路径
    NSString *localFilePath = [[self cacheDocumentPath] stringByAppendingPathComponent:@"version.plist"];
    if ([[NSFileManager defaultManager] fileExistsAtPath:localFilePath isDirectory:nil]) {
        [[NSFileManager defaultManager] removeItemAtPath:localFilePath error:nil];
    }
    
    NSString* ManifestVersion = @"https://mlpplus.gikoo.cn/AppPublishServer/download/953/";

    NSDictionary *lastDownloadDictionay = [GKArchiveUtils loadWithKey:Enterprise_Cache_Name];
    NSString *serverDownloadURL = lastDownloadDictionay[@"versionurl"];
    if (serverDownloadURL.length == 0) {
        serverDownloadURL = ManifestVersion;
    }
    
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        NSDictionary *dic = [[NSDictionary alloc] initWithContentsOfURL:[NSURL URLWithString:serverDownloadURL]];
        if (dic == nil) {
            dic = [[NSDictionary alloc] initWithContentsOfURL:[NSURL URLWithString:ManifestVersion]];
        }
        dispatch_async(dispatch_get_main_queue(), ^{
            if (dic == nil || ![dic.allKeys containsObject:@"version"]) {
                return ;
            }
            
            [GKArchiveUtils save:dic Key:Enterprise_Cache_Name];
            
            NSString *serverVersion = dic[@"version"];
            NSString *localVersion = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];
            
            NSLog(@"---local: %@----server: %@---", localVersion, serverVersion);
            
            NSArray *serverVersionArray = [serverVersion componentsSeparatedByString:@"."];
            NSArray *localVersionArray = [localVersion componentsSeparatedByString:@"."];
            @try {
                for (int i = 0; i< serverVersionArray.count; i++) {
                    int server = [serverVersionArray[i] intValue];
                    int local = 0;
                    if (i <= localVersionArray.count-1) {
                        local = [localVersionArray[i] intValue];
                    }
                    
                    if (server > local) {
                        alertDisplaying = YES;
                        NSString *title = @"版本已发布";
                        NSString *cancelTitle = @"稍后更新";
                        NSString *okTitle = @"立即更新";
                        
                        UIAlertView* alertView = [UIAlertView bk_alertViewWithTitle:title message:dic[@"updateinfo"]];
                        
                        [alertView bk_addButtonWithTitle:okTitle handler:^{
                            alertDisplaying = NO;
                            NSString *appURL = [@"itms-services://?action=download-manifest&url=" stringByAppendingString:dic[@"appurl"]];
                            [[UIApplication sharedApplication] openURL:[NSURL URLWithString:appURL]];
                        }];
                        
                        [alertView bk_setCancelButtonWithTitle:cancelTitle handler:^{
                            alertDisplaying = NO;
                        }];
                        
                        [alertView show];
                        break;
                    }else if (server < local){
                        break;
                    }
                }
            }
            @catch (NSException *exception) {
                NSLog(@"%@", exception.reason);
            }
            @finally {
                
            }
            
        });
    });
}

+ (NSString *)cacheDocumentPath
{
    NSString *document = [NSHomeDirectory() stringByAppendingPathComponent:@"Library/Caches/TaskCache"];
    
    return [[self class] cacheDocumentPathInDocument:document];
}

+ (NSString *)cacheDocumentPathInDocument:(NSString *)document
{
    NSFileManager *defaultManager = [NSFileManager defaultManager];
    
    if (![defaultManager fileExistsAtPath:document]) {
        [defaultManager createDirectoryAtPath:document withIntermediateDirectories:NO attributes:nil error:nil];
    }
    
    //support multi accounts
    
    NSString *userName = [[[NSUserDefaults standardUserDefaults] objectForKey:@"userName"] stringByReplacingOccurrencesOfString:@"/" withString:@""];
    userName = [userName stringByReplacingOccurrencesOfString:@"." withString:@""];
    userName = [userName stringByReplacingOccurrencesOfString:@" " withString:@""];
    userName = [userName stringByReplacingOccurrencesOfString:@"@" withString:@""];
    
    document = [document stringByAppendingPathComponent:userName];
    
    if (![defaultManager fileExistsAtPath:document]) {
        [defaultManager createDirectoryAtPath:document withIntermediateDirectories:NO attributes:nil error:nil];
    }
    
    NSDictionary *attributes = [[NSFileManager defaultManager] attributesOfItemAtPath:document error:nil];
    //NSLog(@"attributes %@", attributes);
    
    if ([attributes[NSFileType] isEqualToString:NSFileTypeRegular]) {
        [defaultManager removeItemAtPath:document error:nil];
        [defaultManager createDirectoryAtPath:document withIntermediateDirectories:NO attributes:nil error:nil];
    }
    
    return document;
    
}
@end
