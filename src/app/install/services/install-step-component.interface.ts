/**
 * Interface for all installation components
 *
 * @module app/install/services/install-step-component.interface
 * @licence MIT 2017 https://github.com/jbouzekri/jbnote/blob/master/LICENSE
 */

/**
 * Interface implemented by each install step to
 * provide the progress level of the config / installation process
 */
export interface InstallStepComponentInterface {
  step: number;
}
