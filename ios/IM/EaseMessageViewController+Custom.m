//
//  EaseMessageViewController+Custom.m
//  RNRecruiterProj
//
//  Created by 彭 on 16/5/4.
//  Copyright © 2016年 Gikoo. All rights reserved.
//

#import "EaseMessageViewController+Custom.h"

@implementation EaseMessageViewController (Custom)

- (void)_sendMessage:(EMMessage *)message
{
    message.ext = [self makeMessageExtWith:message.ext];

    if (self.conversation.type == EMConversationTypeGroupChat){
        message.chatType = EMChatTypeGroupChat;
    }
    else if (self.conversation.type == EMConversationTypeChatRoom){
        message.chatType = EMChatTypeChatRoom;
    }
    
    [self addMessageToDataSource:message
                        progress:nil];
    
    __weak typeof(self) weakself = self;
    [[EMClient sharedClient].chatManager asyncSendMessage:message progress:nil completion:^(EMMessage *aMessage, EMError *aError) {
        [weakself.tableView reloadData];
    }];
}

- (NSDictionary*)makeMessageExtWith:(NSDictionary*)origExt {
    NSMutableDictionary* newExt = [NSMutableDictionary dictionaryWithDictionary:origExt];
    
    
    
    return newExt;
}

@end
