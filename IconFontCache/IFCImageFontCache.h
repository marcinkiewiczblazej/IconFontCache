#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>


@interface IFCImageFontCache : NSObject

+ (IFCImageFontCache *)sharedCache;

@property (nonatomic, copy) NSString *fontName;

- (UIImage *)imageForIcon:(NSString *)icon size:(CGFloat)size;

- (UIFont *)fontWithSize:(CGFloat)size;

@end
