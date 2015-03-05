Pod::Spec.new do |s|
  s.name = 'IconFontCache'
  s.version = '0.1.0'
  s.summary = 'Font renderer with caching.'
  s.description = <<-DESC
Font renderer which help you work with assets inside TTF files. It can render font to image and cache it for further reuse.
DESC
  s.author = {
    'Blazej Marcinkiewicz' => 'marcinkiewicz.blazej@gmail.com'
  }
  s.source_files = 'IconFontCache/**/*.{h,m}'
  s.public_header_files = 'IconFontCache/**/*.h'
  s.framework = 'Foundation'
  s.platform = :ios, '7.0'
  s.source = {
    :git => 'https://github.com/marcinkiewiczblazej/IconFontCache.git'
  }
  s.license = {
    :type => 'MIT'
  }
  s.homepage = 'https://github.com/marcinkiewiczblazej/IconFontCache'

end
