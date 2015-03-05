#import <UIKit/UIKit.h>
#import "IFCImageFontCache.h"

static IFCImageFontCache *sharedInstance = nil;

@interface IFCImageFontCache ()
@property(nonatomic, strong) NSCache *cachedImages;
@end

@implementation IFCImageFontCache {

}

- (instancetype)init {
    self = [super init];
    if (self) {
        self.cachedImages = [[NSCache alloc] init];
    }

    return self;
}

+ (IFCImageFontCache *)sharedCache {
    static dispatch_once_t token;
    dispatch_once(&token, ^{
        sharedInstance = [[self alloc] init];
    });

    return sharedInstance;
}

- (UIImage *)imageForIcon:(NSString *)icon size:(CGFloat)size {
    if (self.fontName == nil) {
        [[NSException exceptionWithName:@"No image font provided." reason:@"Image font name was not set for image font cache." userInfo:nil] raise];
    }

    NSString *iconIdentifier = [self iconIdentifierForIcon:icon size:size];
    UIImage *cachedImage = [self.cachedImages objectForKey:iconIdentifier];
    if (cachedImage) {
        return cachedImage;
    }
    
    UIImage *renderedImage = [self renderedImageForIcon:icon size:size];

    [self.cachedImages setObject:renderedImage forKey:iconIdentifier];
    return renderedImage;
}

- (UIImage *)renderedImageForIcon:(NSString *)icon size:(CGFloat)size {
    UIFont *font = [self fontWithSize:size];
    NSDictionary *attrs = @{
            NSFontAttributeName : font
    };
    CGSize textSize = [icon sizeWithAttributes:attrs];

    UIGraphicsBeginImageContext(textSize);

    [icon drawInRect:CGRectMake(0, 0, textSize.width, textSize.height) withAttributes:attrs];

    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
            
    return image;
}

- (NSString *)iconIdentifierForIcon:(NSString *)icon size:(CGFloat)size {
    return [NSString stringWithFormat:@"%@_%f", icon, size];
}

- (UIFont *)fontWithSize:(CGFloat)size {
    return [UIFont fontWithName:self.fontName size:size];;
}


@end
