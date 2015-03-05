﻿//*************************************
//*************************************
//  Script
//*************************************
//*************************************
main();
function main() {
    var windowResource = windowResource = "dialog {  \
    orientation: 'column', \
    alignChildren: ['fill', 'top'],  \
    preferredSize:[300, 130], \
    text: 'Font parameters',  \
    margins:15, \
    \
    ascentGroup: Group{\
       ascentLabel: StaticText { text: 'Ascent:' }, \
       ascentTextField: EditText { text: '850', characters: 5, justify: 'left'}, \
    }\
    descentGroup: Group{\
       descentLabel: StaticText { text: 'Descent:' }, \
       descentTextField: EditText { text: '150', characters: 5, justify: 'left'} \
    }\
    bottomGroup: Group{ \
        cancelButton: Button { text: 'Cancel', properties:{name:'cancel'}, size: [120,24], alignment:['right', 'center'] }, \
        applyButton: Button { text: 'Apply', properties:{name:'ok'}, size: [120,24], alignment:['right', 'center'] }, \
    }\
}"


var window = new Window(windowResource);

window.bottomGroup.cancelButton.onClick = function() {
  return window.close();
};
window.bottomGroup.applyButton.onClick = function() {
  var ascent = window.ascentGroup.ascentTextField.text;
  var descent = window.descentGroup.descentTextField.text;
  generateFont(ascent, descent);
  return window.close();
};

window.show();
}

// Helper functions
function generateFont(ascent, descent) {
    var tmpDir = app.activeDocument.path + '/tmpIconFont';
    var tmpDirFile = new Folder(tmpDir);
    var outputDir = new Folder(app.activeDocument.path + '/output');
    outputDir.create();
    tmpDirFile.create();
    var files = tmpDirFile.getFiles();

    // Clear tmp directory
    for (var i = 0; i < files.length; ++i) {
        files[i].remove();
    }
    var files = outputDir.getFiles();
    for (var i = 0; i < files.length; ++i) {
        files[i].remove();
    }

    var files = File.openDialog ('Select files:', null, true);
    if (files == null) {
        return;
    }

    var mapping = generateConfigFile(files, tmpDir, ascent, descent);
    copyGlyphs(files, tmpDir);

    var file = (new File($.fileName)).parent;
    var script_file = new File(file + '/create_font');
    script_file.copy(tmpDir + '/create_font');

    chmodScript (tmpDir);

    var androidStrings = generateAndroidResources(mapping);
    var androidStringsFile = new File(outputDir + '/icon-font-strings.xml');
    androidStringsFile.open('w');
    androidStringsFile.lineFeed = "Unix";
    androidStringsFile.write(androidStrings);
    androidStringsFile.close();

    generateiOSResources(mapping, outputDir);    
}

// Thanks to: https://github.com/fabiantheblind/exec-term/blob/master/create_and_execute_term.jsx
function createTermFile(term_file_name, path, script) {
/*
http://docstore.mik.ua/orelly/unix3/mac/ch01_03.htm
1.3.1.1. .term files
You can launch a customized Terminal window from the command line by saving some prototypical Terminal settings to a .term file,
then using the open command to launch the .term file (see "open" in Section 1.5.4, later in this chapter).
You should save the .term file someplace where you can find it later, such as ~/bin or ~/Documents.
If you save it in ~/Library/Application Support/Terminal, the .term file will show up in Terminal's File  Library menu.
To create a .term file, open a new Terminal window, and then open the Inspector (File  Show Info, or -I)
and set the desired attributes, such as window size, fonts, and colors. When the Terminal's attributes
have been set, save the Terminal session (File Save, or -S) to a .term file (for example, ~/Documents/proto.term).
Now, any time you want to launch a Terminal window from the command line, you can issue the following command:
 */
  var termfile = new File(path + "/" + term_file_name + ".term");
  termfile.open("w");
  termfile.writeln(
      "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
      "<!DOCTYPE plist PUBLIC \"-//Apple Computer//DTD PLIST 1.0//EN\"" +
      "\"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">\n" +
      "<plist version=\"1.0\">\n" +
      "<dict>\n" +
      "<key>WindowSettings</key>\n" +
      "<array>\n" +
      " <dict>\n" +
      "<key>CustomTitle</key>\n" +
      "<string>My first termfile</string>\n" +
      "<key>ExecutionString</key>\n" +
      "<string>" + script + "</string>\n" +
      "</dict>\n" +
      "</array>\n" +
      "</dict>\n" +
      "</plist>\n");
  termfile.close();
  return termfile;
};

function chmodScript(tmpDir) {
    var decoded = decodeURIComponent (tmpDir).replace(" ", '\\ ');
    var chmodScript = createTermFile ('chmod', tmpDir, "cd " + decoded + "\nchmod a+x ./create_font\n./create_font\ncp ./icon-font.ttf ../output/");
    chmodScript.execute();
}

function generateConfigFile(files, tmpDir, ascent, descent) {
    var configFile = new File(tmpDir + "/config.yml");
    configFile.open("w");
    configFile.lineFeed = "Unix";
    configFile.writeln("font:");
    configFile.writeln("  version: \"1.0\"");
    configFile.writeln("  fontname: iconfont"); 
    configFile.writeln("  fullname: iconfont");
    configFile.writeln("  familyname: iconfont");
    configFile.writeln("  ascent: " + ascent);
    configFile.writeln("  descent: " + descent);
    configFile.writeln("  weight: Normal");
    configFile.writeln("glyphs:");
    var mapping = {};
    var code = 0xe000;
    for (var i = 0; i < files.length; ++i) {
        var file = files[i];
        configFile.writeln("  -");
        var filename = file.name.replace("%20", "_");
        configFile.writeln("    file: " + filename);
        var codeString = ("0000" + code.toString(16)).slice(-4);
        configFile.writeln("    code: 0x" + codeString);
        mapping[filename] = codeString;
        ++code;
    }

    configFile.close();
    return mapping;
}

function copyGlyphs(files, tmpDir) {
    for (var i = 0; i < files.length; ++i) {
        var file = files[i];
        file.copy(tmpDir + "/" + file.name.replace("%20", "_"));
    }
}

function generateAndroidResources(mapping) {
    var result = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
    result = result + "<resources>\n";
    for (var key in mapping) {
            var layerName = inferredLayerName (key);
            if (layerName != null) {
                    result = result + "<string name=\"" + androidStringFromLayer(layerName) + "\">\\u" + mapping[key].toUpperCase() + "</string>\n"
            }
    }
    result = result + "</resources>";
    return result;
}


function generateiOSResources(mapping, outputFolder) {
    var headerFile = new File(outputFolder + '/NSString+IFCImageFont.h');
    headerFile.open('w');
    var implementationFile = new File(outputFolder + '/NSString+IFCImageFont.m');
    implementationFile.open('w');
    
    headerFile.writeln("#import <Foundation/Foundation.h>");
    headerFile.writeln("@interface NSString (IFCImageFont)");
    
    implementationFile.writeln("#import \"NSString+IFCImageFont.h\"");
    implementationFile.writeln("@implementation NSString (IFCImageFont)");
    
    for (var key in mapping) {
            var layerName = inferredLayerName (key);
            if (layerName != null) {
                    var iconName = iOSStringFromLayer (layerName);
                    if (iconName != null) {
                        headerFile.writeln("+(NSString *)" + iconName + ";");
                        implementationFile.writeln("+(NSString *)" + iconName + " {");
                        implementationFile.writeln("    return @\"\\u" + mapping[key].toUpperCase() + "\";");
                        implementationFile.writeln("}");
                    }      
            }
    }
    
    implementationFile.writeln("@end");
    headerFile.writeln("@end");
    
    implementationFile.close();
    headerFile.close();
}

function inferredLayerName(filename) {
    for (var i = 0; i < app.activeDocument.artboards.length; ++i) {
        var result = filename.lastIndexOf (app.activeDocument.artboards[i].name.replace(" ", "_") + ".svg");
                if (result != -1) {
                        return app.activeDocument.artboards[i].name;
                }
        }
    return null;
}

function androidStringFromLayer(layerName) {
        var result = layerName.replace (" ", "_");
        return result;
}

function iOSStringFromLayer(layerName) {
        var result = layerName.split ('/[ _]/');
        if (result.length == 0) {
                return null;
        }

        var name = result[0];
        for (var i = 1; i < result.length; ++i) {
                name = name.concat(capitaliseFirstLetter (string));
        }

        return name;
}

function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}
