//
//  GKChatViewController.m
//  RNRecruiterProj
//
//  Created by 彭 on 16/5/6.
//  Copyright © 2016年 Gikoo. All rights reserved.
//

#import "GKChatViewController.h"
#import "GKCustomMessageCell.h"
#import "EaseMessageTimeCell.h"
#import "GKRobotTipMessageModel.h"
#import "GKRobotTipMessageCell.h"

#import <objc/runtime.h>

@interface GKChatViewController ()<EaseMessageViewControllerDelegate, EaseMessageViewControllerDataSource, EMClientDelegate>

@property (nonatomic) NSMutableDictionary *emotionDic;

@end

@implementation GKChatViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    [self setupMethodSwizzling];
    
    [[EaseBaseMessageCell appearance] setSendBubbleBackgroundImage:[[UIImage imageNamed:@"chat_sender_bg"] stretchableImageWithLeftCapWidth:10 topCapHeight:28]];
    [[EaseBaseMessageCell appearance] setRecvBubbleBackgroundImage:[[UIImage imageNamed:@"chat_receiver_bg"] stretchableImageWithLeftCapWidth:20 topCapHeight:29]];
    
    [[EaseBaseMessageCell appearance] setMessageNameIsHidden:YES];
    
    // Do any additional setup after loading the view.
    self.delegate = self;
    self.dataSource = self;
    
    [[EMClient sharedClient] addDelegate:self delegateQueue:nil];
    
    [self setupBarButtonItem];
}

- (void)dealloc {
    [[EMClient sharedClient] removeDelegate:self];
}

- (void)setupMethodSwizzling {
    method_exchangeImplementations(class_getInstanceMethod([EaseMessageViewController class], @selector(formatMessages:)), class_getInstanceMethod([self class], @selector(swizzled_formatMessages:)));
    
//    method_exchangeImplementations(class_getInstanceMethod([EaseMessageTimeCell class], @selector(titleLabel)), class_getInstanceMethod([self class], @selector(swizzled_titleLabel)));
}

- (void)setupBarButtonItem {
    UIBarButtonItem *backItem = [[UIBarButtonItem alloc]initWithTitle:@"完成" style:UIBarButtonItemStyleDone target:self action:@selector(tapDone:)];
    [self.navigationItem setRightBarButtonItem:backItem];
    
}

- (void)tapDone:(id)sender {
    [self.navigationController dismissViewControllerAnimated:YES completion:nil];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#pragma mark - EaseMessageViewControllerDelegate

//- (BOOL)messageViewController:(EaseMessageViewController *)viewController
//   canLongPressRowAtIndexPath:(NSIndexPath *)indexPath
//{
//    return YES;
//}

#pragma mark - EaseMessageViewControllerDataSource

- (UITableViewCell *)messageViewController:(UITableView *)tableView
                       cellForMessageModel:(id<IMessageModel>)messageModel {
    if ([messageModel isKindOfClass:[GKRobotTipMessageModel class]]) {
        NSString *CellIdentifier = [GKRobotTipMessageCell cellIdentifierWithModel:messageModel];
        
        GKRobotTipMessageCell *sendCell = (GKRobotTipMessageCell *)[tableView dequeueReusableCellWithIdentifier:CellIdentifier];
        
        // Configure the cell...
        if (sendCell == nil) {
            sendCell = [[GKRobotTipMessageCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:CellIdentifier model:messageModel];
            sendCell.selectionStyle = UITableViewCellSelectionStyleNone;
        }
        
        sendCell.contentView.backgroundColor = [UIColor yellowColor];
        
        return sendCell;
    }
    
    NSString *CellIdentifier = [EaseMessageCell cellIdentifierWithModel:messageModel];
    
    GKCustomMessageCell *sendCell = (GKCustomMessageCell *)[tableView dequeueReusableCellWithIdentifier:CellIdentifier];
    
    // Configure the cell...
    if (sendCell == nil) {
        sendCell = [[GKCustomMessageCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:CellIdentifier model:messageModel];
        sendCell.selectionStyle = UITableViewCellSelectionStyleNone;
    }
    
    sendCell.model = messageModel;
    return sendCell;
    
    return nil;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    id object = [self.dataArray objectAtIndex:indexPath.row];
    if ([object isKindOfClass:[GKRobotTipMessageModel class]]) {
        return 60;
    }
    
    return [super tableView:tableView heightForRowAtIndexPath:indexPath];
}

- (NSArray*)emotionFormessageViewController:(EaseMessageViewController *)viewController
{
    NSMutableArray *emotions = [NSMutableArray array];
    for (NSString *name in [EaseEmoji allEmoji]) {
        EaseEmotion *emotion = [[EaseEmotion alloc] initWithName:@"" emotionId:name emotionThumbnail:name emotionOriginal:name emotionOriginalURL:@"" emotionType:EMEmotionDefault];
        [emotions addObject:emotion];
    }
    EaseEmotion *temp = [emotions objectAtIndex:0];
    EaseEmotionManager *managerDefault = [[EaseEmotionManager alloc] initWithType:EMEmotionDefault emotionRow:3 emotionCol:7 emotions:emotions tagImage:[UIImage imageNamed:temp.emotionId]];
    
    NSMutableArray *emotionGifs = [NSMutableArray array];
    _emotionDic = [NSMutableDictionary dictionary];
    NSArray *names = @[@"icon_002",@"icon_007",@"icon_010",@"icon_012",@"icon_013",@"icon_018",@"icon_019",@"icon_020",@"icon_021",@"icon_022",@"icon_024",@"icon_027",@"icon_029",@"icon_030",@"icon_035",@"icon_040"];
    int index = 0;
    for (NSString *name in names) {
        index++;
        EaseEmotion *emotion = [[EaseEmotion alloc] initWithName:[NSString stringWithFormat:@"[示例%d]",index] emotionId:[NSString stringWithFormat:@"em%d",(1000 + index)] emotionThumbnail:[NSString stringWithFormat:@"%@_cover",name] emotionOriginal:[NSString stringWithFormat:@"%@",name] emotionOriginalURL:@"" emotionType:EMEmotionGif];
        [emotionGifs addObject:emotion];
        [_emotionDic setObject:emotion forKey:[NSString stringWithFormat:@"em%d",(1000 + index)]];
    }
    EaseEmotionManager *managerGif= [[EaseEmotionManager alloc] initWithType:EMEmotionGif emotionRow:2 emotionCol:4 emotions:emotionGifs tagImage:[UIImage imageNamed:@"icon_002_cover"]];
    
    return @[managerDefault,managerGif];
}

- (BOOL)isEmotionMessageFormessageViewController:(EaseMessageViewController *)viewController
                                    messageModel:(id<IMessageModel>)messageModel
{
    BOOL flag = NO;
    if ([messageModel.message.ext objectForKey:MESSAGE_ATTR_IS_BIG_EXPRESSION]) {
        return YES;
    }
    return flag;
}

- (EaseEmotion*)emotionURLFormessageViewController:(EaseMessageViewController *)viewController
                                      messageModel:(id<IMessageModel>)messageModel
{
    NSString *emotionId = [messageModel.message.ext objectForKey:MESSAGE_ATTR_EXPRESSION_ID];
    EaseEmotion *emotion = [_emotionDic objectForKey:emotionId];
    if (emotion == nil) {
        emotion = [[EaseEmotion alloc] initWithName:@"" emotionId:emotionId emotionThumbnail:@"" emotionOriginal:@"" emotionOriginalURL:@"" emotionType:EMEmotionGif];
    }
    return emotion;
}

- (NSDictionary*)emotionExtFormessageViewController:(EaseMessageViewController *)viewController
                                        easeEmotion:(EaseEmotion*)easeEmotion
{
    return @{MESSAGE_ATTR_EXPRESSION_ID:easeEmotion.emotionId,MESSAGE_ATTR_IS_BIG_EXPRESSION:@(YES)};
}

#pragma mark - EMClientDelegate

- (void)didLoginFromOtherDevice
{
    if ([self.imagePicker.mediaTypes count] > 0 && [[self.imagePicker.mediaTypes objectAtIndex:0] isEqualToString:(NSString *)kUTTypeMovie]) {
        [self.imagePicker stopVideoCapture];
    }
}

- (void)didRemovedFromServer
{
    if ([self.imagePicker.mediaTypes count] > 0 && [[self.imagePicker.mediaTypes objectAtIndex:0] isEqualToString:(NSString *)kUTTypeMovie]) {
        [self.imagePicker stopVideoCapture];
    }
}


#pragma mark - private

- (void)addLineToArray:(NSMutableArray*)array isFirst:(BOOL)isFirst {
    GKRobotTipMessageModel* robotModel = [[GKRobotTipMessageModel alloc]init];
    
    [array addObject:robotModel];
    
//    if (isFirst) {
//        [array addObject:@"捷库招聘助理聊天记录\n--------------------------------------"];
//    }
//    else {
//        [array addObject:@"--------------------------------------\n以上为捷库招聘助理与应聘者的聊天记录\n上拉可查看更多"];
//    }
}

- (NSArray *)swizzled_formatMessages:(NSArray *)messages {
    NSArray* ret = [self swizzled_formatMessages:messages];
    
    NSMutableArray* result = [NSMutableArray new];
    
    for (id obj in ret) {
        if (![obj isKindOfClass:[NSString class]]) {
            id<IMessageModel> model = obj;
            
            EMMessage* message = model.message;
            if (message) {
                if ([message isRobotBeginMessage]) {
                    [self addLineToArray:result isFirst:YES];
                }
                
                [result addObject:obj];
                
                if ([message isRobotEndMessage]) {
                    [self addLineToArray:result isFirst:NO];
                }
            }
        }
        else {
            [result addObject:obj];
        }
    }
    
    return result;
}

- (UILabel*)swizzled_titleLabel {
    UILabel* titleLabel = [self swizzled_titleLabel];
    
    
    return titleLabel;
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
