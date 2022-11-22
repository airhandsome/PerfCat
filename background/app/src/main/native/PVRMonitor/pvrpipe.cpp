//
// Created by y on 2022/11/8.
//

#include "pvrpipe.h"

PVRPipe *PVRPipe::_instance = NULL;

PVRPipe::PVRPipe()
{
    pPVRScopeHUD = new PVRScopeHUD();
    pCPUMetrics = new CPUMetrics();
}

PVRPipe::PVRPipe(PVRScopeHUD* hub, CPUMetrics* metric) {
    pPVRScopeHUD = hub;
    pCPUMetrics = metric;
}


PVRPipe *PVRPipe::Instance() {
    if (!_instance){
        _instance = new PVRPipe();
    }
    return _instance;
}

PVRPipe *PVRPipe::Instance(PVRScopeHUD *hub, CPUMetrics *metric) {
    _instance = new PVRPipe(hub, metric);
    return _instance;
}



bool PVRPipe::initGpuCounter() {

    if (!pPVRScopeHUD->initialisePVRScope())
    {
        LOGE("Error: cannot connect to PVRScope.\n");
        return false;
    }

    LOGI("Initialised PVRScope");
    return true;
}

bool PVRPipe::deInitGpuCounter() {
    pPVRScopeHUD->deinitialisePVRScope();

    delete(pPVRScopeHUD);
    pPVRScopeHUD = NULL;

    return true;
}