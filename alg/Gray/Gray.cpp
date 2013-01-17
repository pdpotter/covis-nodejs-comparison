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

        // parse the argv array
        cmd.parse( argc, argv );

        // read the input image
        std::string input = inputArg.getValue();
        cv::Mat image = cv::imread(input);

        // convert the image to gray levels
        cv::Mat result(image.size(),CV_MAKETYPE(image.depth(),image.channels()));
        cv::cvtColor(image,result,CV_BGR2GRAY);

        // write the result
        cv::imwrite(outputArg.getValue().c_str(),result);

        // release
        result.release();
        image.release();

    } catch (TCLAP::ArgException &e){  // catch any exceptions
        std::cerr << "error: " << e.error() << " for arg " << e.argId() << std::endl;
    }

}
