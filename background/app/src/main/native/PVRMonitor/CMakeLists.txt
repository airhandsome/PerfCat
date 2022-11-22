# For more information about using CMake with Android Studio, read the
# documentation: https://d.android.com/studio/projects/add-native-code.html

# Sets the minimum version of CMake required to build the native library.

cmake_minimum_required(VERSION 3.4.1)
project(pvrpipe LANGUAGES C CXX)

add_library(PVRScopeDeveloper STATIC IMPORTED)

set_target_properties(	PVRScopeDeveloper
        PROPERTIES IMPORTED_LOCATION
        ${CMAKE_CURRENT_SOURCE_DIR}/../libs/${ANDROID_ABI}/libPVRScopeDeveloper.a)

set(PROJECT_FILES
        pvrpipe.h
        pvrpipe.cpp
    )
if(UNIX AND NOT APPLE)
    list(APPEND PROJECT_FILES
            CPUMetrics.h
            PVRScopeStats.h
            CPUMetrics.cpp
            PVRScopeHUD.h
            PVRScopeHUD.cpp
            )
endif()

#source_group("/" FILES ${PROJECT_FILES})

add_library(${PROJECT_NAME} STATIC ${PROJECT_FILES})


find_library(
        log-lib
        log
)
target_include_directories(${PROJECT_NAME} PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})


target_link_libraries(${PROJECT_NAME} PVRScopeDeveloper ${log-lib})




