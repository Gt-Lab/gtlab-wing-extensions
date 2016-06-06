/**
 * @copyright www.egret.com
 * @author 东北大客
 * @desc Label是可以呈示一行或多行统一格式文本的UI组件。要显示的文本由te
 *      xt属性确定。文本格式由样式属性指定，例如fontFamily和size
 *      。因为Label运行速度快且占用内存少，所以它特别适合用于显示多个小型非
 *      交互式文本的情况，例如，项呈示器和Button外观中的标签。在Label
 *      中，将以下三个字符序列识别为显式换行符：CR（“\r”）、LF（“\n”
 *      ）和CR+LF（“\r\n”）。如果没有为Label指定宽度，则由这些显
 *      式换行符确定的最长行确定Label的宽度。如果指定了宽度，则指定文本将在
 *      组件边界的右边缘换行，如果文本扩展到低于组件底部，则将被剪切。
 */

class Main extends eui.UILayer {

    public constructor() {
        super();
        this.once(egret.Event.ADDED_TO_STAGE, this.addToStage, this);
    }

    private addToStage() {
        /*** 本示例关键代码段开始 ***/
        var label: eui.Label = new eui.Label();
        label.text = "Label 是可以呈示一行或多行统一格式文本的 UI 组件 \r\n 要显示的文本由 text 属性确定";
        //设置颜色等文本属性
        label.textColor = 0xff0000;
        label.size = 16;
        label.lineSpacing = 12;
        label.textAlign = egret.HorizontalAlign.JUSTIFY;
        /*** 本示例关键代码段结束 ***/

        this.addChild(label);
        label.verticalCenter = 0;
        label.horizontalCenter = 0;


        var button = new eui.Button();
        button.x = 100;
        button.y = 200;
        button.width = 100;
        button.height = 40;
        button.label = "确定";
        button.skinName = "resource/eui_skins/ButtonSkin.exml";
        button.addEventListener(egret.TouchEvent.TOUCH_TAP,function () {
            button.label = 'touch';
        },this);
        
        button.addEventListener(egret.TouchEvent.TOUCH_ROLL_OVER,function () {
            console.log('TOUCH_ROLL_OVER');
        },this);
        
        this.addChild(button);
        
        
        // var myLayer = new eui.UILayer();
        var button2 = new eui.Button();
        button2.x = 300;
        button2.y = 300;
        button2.width = 100;
        button2.height = 40;
        button2.label = "abc";
        button2.skinName = "resource/eui_skins/ButtonSkin.exml";
        // myLayer.addChild(button2);

        this.addChild(button2);
    }
}
