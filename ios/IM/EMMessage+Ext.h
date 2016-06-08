//
//  EMMessage+Ext.h
//  Gikoo5
//
//  Created by 彭 on 16/3/22.
//  Copyright © 2016年 gikoo. All rights reserved.
//

#import "EMMessage.h"

@interface EMMessage (Ext)

- (BOOL)isSender;
- (BOOL)isRobotHistoryMessage;
- (NSDictionary*)lastRobotHistoryDictionary;
- (NSString*)lastRobotHistoryMessageText;
- (BOOL)isRobotBeginMessage;
- (BOOL)isRobotEndMessage;

@end
