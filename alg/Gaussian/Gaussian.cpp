#include <iostream>

#include "tclap/CmdLine.h"

#include "opencv/cv.h"
#include "opencv/highgui.h"

int main(int argc, char ** argv)
{
    try{
        // construct CLI
        TCLAP::CmdLine cmd("Gaussian", ' ', "0.1");

        TCLAP::ValueArg<std::string> inputArg("i", "input", "Input image file", true, "", "string");
        cmd.add(inputArg);
        TCLAP::ValueArg<std::string> outputArg("o", "output", "Output image file", true, "", "string");
        cmd.add(outputArg);
        TCLAP::ValueArg<int> kernelSizeArg("k", "kernel_size", "Size of the kernel to be used", false, 7, "int");
        cmd.add(kernelSizeArg);

        // parse the argv array
        cmd.parse( argc, argv );

        // read the input image
        std::string input = inputArg.getValue();
        cv::Mat image = cv::imread(input);

        // apply the gaussian filter with the desired kernel size
        cv::Mat result(image.size(),CV_MAKETYPE(image.depth(),image.channels()));
        int kernelSize = kernelSizeArg.getValue();
        cv::GaussianBlur(image,result,cv::Size(kernelSize,kernelSize),0,0);

        // write the result
        imwrite(outputArg.getValue().c_str(),result);

        // release
        result.release();
        image.release();

    } catch (TCLAP::ArgException &e){  // catch any exceptions
        std::cerr << "error: " << e.error() << " for arg " << e.argId() << std::endl;
    }

}
