//
// Created by y on 2022/11/8.
//

#ifndef UPRTECH_PVRPIPE_H
#define UPRTECH_PVRPIPE_H

#include "PVRScopeHUD.h"
#include "CPUMetrics.h"
#include "common.h"

class PVRPipe {

public:
    static PVRPipe *Instance();

    static PVRPipe *Instance(PVRScopeHUD *hub, CPUMetrics *metric);

    bool initGpuCounter();

    bool deInitGpuCounter();

    CPUMetrics *pCPUMetrics = NULL;
    PVRScopeHUD *pPVRScopeHUD = NULL;
private:
    static PVRPipe *_instance;

    PVRPipe();

    PVRPipe(PVRScopeHUD *hub, CPUMetrics *metric);

};

#endif //UPRTECH_PVRPIPE_H
