# biliConcat

用于连接bilibili手机客户端下载的分片视频。

需要本地有ffmpeg。

# 安装

需要先安装[npm](https://nodejs.org/en/download/)和[ffmpeg](http://ffmpeg.org/download.html)，并使ffmpeg可以通过命令直接调用（比如放进PATH）

安装本工具:

（windows）以管理员身份打开`cmd`或`powershell`

（其他）以root身份打开一个shell

输入命令
```shell
npm i biliconcat -g
```
命令执行结束并没有看见任何错误信息即安装完成

# 使用

到存在`entry.json`文件的目录的上一级目录（包含了合集下所有视频目录的目录）执行以下命令

```shell
biliConcat
```

就会开始合并合集下的所有视频分片，结果存放在执行命令的目录的`result`中。
